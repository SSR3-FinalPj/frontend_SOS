// Minimal ZIP (no compression, STORE method)
// Reference: https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT

function uint32LE(n) {
  const b = new Uint8Array(4);
  const dv = new DataView(b.buffer);
  dv.setUint32(0, n >>> 0, true);
  return b;
}
function uint16LE(n) {
  const b = new Uint8Array(2);
  const dv = new DataView(b.buffer);
  dv.setUint16(0, n & 0xffff, true);
  return b;
}

export class ZipWriter {
  constructor() {
    this.files = [];
    this.offset = 0;
    this.parts = [];
  }

  addFile(name, contentUint8) {
    const nameBytes = new TextEncoder().encode(name);
    const crc = crc32(contentUint8);
    const size = contentUint8.byteLength;
    // DOS time/date and UTF-8 flag
    const now = new Date();
    const dosT = dosTime(now);
    const dosD = dosDate(now);
    const flags = 0x0800; // bit 11: UTF-8 file names
    const localHeader = [
      uint32LE(0x04034b50), // local file header sig
      uint16LE(20), // version needed
      uint16LE(flags), // flags (UTF-8)
      uint16LE(0), // compression method (0=store)
      uint16LE(dosT), // mod time
      uint16LE(dosD), // mod date
      uint32LE(crc >>> 0),
      uint32LE(size),
      uint32LE(size),
      uint16LE(nameBytes.length),
      uint16LE(0), // extra len
    ];
    const start = this.offset;
    const part = concat([...localHeader, nameBytes, contentUint8]);
    this.parts.push(part);
    this.offset += part.byteLength;

    this.files.push({ nameBytes, crc, size, offset: start });
  }

  build() {
    const cdParts = [];
    let cdSize = 0;
    for (const f of this.files) {
      const now = new Date();
      const dosT = dosTime(now);
      const dosD = dosDate(now);
      const flags = 0x0800;
      const header = [
        uint32LE(0x02014b50), // central dir sig
        uint16LE(20), // version made by
        uint16LE(20), // version needed
        uint16LE(flags),
        uint16LE(0), // method
        uint16LE(dosT),
        uint16LE(dosD),
        uint32LE(f.crc >>> 0),
        uint32LE(f.size),
        uint32LE(f.size),
        uint16LE(f.nameBytes.length),
        uint16LE(0), // extra len
        uint16LE(0), // comment len
        uint16LE(0), // disk number
        uint16LE(0), // internal attrs
        uint32LE(0), // external attrs
        uint32LE(f.offset),
      ];
      const entry = concat([...header, f.nameBytes]);
      cdParts.push(entry);
      cdSize += entry.byteLength;
    }
    const cdStart = this.offset;
    const cdBlob = concat(cdParts);
    this.parts.push(cdBlob);
    this.offset += cdBlob.byteLength;

    const eocd = concat([
      uint32LE(0x06054b50),
      uint16LE(0), // disk
      uint16LE(0), // start disk
      uint16LE(this.files.length),
      uint16LE(this.files.length),
      uint32LE(cdSize),
      uint32LE(cdStart),
      uint16LE(0), // comment len
    ]);
    this.parts.push(eocd);
    this.offset += eocd.byteLength;

    return new Blob(this.parts, { type: 'application/zip' });
  }
}

function concat(arrays) {
  if (!arrays || arrays.length === 0) return new Uint8Array();
  const total = arrays.reduce((s, a) => s + (a.byteLength || a.length), 0);
  const out = new Uint8Array(total);
  let o = 0;
  for (const a of arrays) {
    const u = a instanceof Uint8Array ? a : new Uint8Array(a);
    out.set(u, o);
    o += u.byteLength;
  }
  return out;
}

// CRC32 (IEEE 802.3)
const table = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(u8) {
  let c = 0xffffffff;
  for (let i = 0; i < u8.length; i++) c = table[(c ^ u8[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function dosTime(date) {
  const seconds = Math.floor(date.getSeconds() / 2);
  return (date.getHours() << 11) | (date.getMinutes() << 5) | seconds;
}
function dosDate(date) {
  return ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
}
