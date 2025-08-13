import imgAi from "figma:asset/548c5ab3324f428427d4386ba5a12aa32aed4760.png";
import img from "figma:asset/8bfbb13de2fdbc124fe1d352174f51e8c3528e2f.png";
import imgAi1 from "figma:asset/3a82b11c3a20611ccab7056fd4474e68165e5bf7.png";
import img1 from "figma:asset/f826eefb93ae2fd71da787fc1d7013ec7b847589.png";
import img2 from "figma:asset/3668f32a80c60d187018df9f3d7fd59d403c3eb3.png";
import imgAi2 from "figma:asset/590cdcfba4b72f535a1a7b80c8b517e2b8332b89.png";
import img3 from "figma:asset/25d34fe5bd124097a179ec0125c12fa6ba4d0ef3.png";

function Heading1() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 1"
    >
      <div className="flex flex-col font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#101828] text-[0px] text-center w-full">
        <p className="leading-[65.63px] text-[52.5px]">
          <span
            className="bg-clip-text bg-gradient-to-r from-[#155dfc] to-[#9810fa]"
            style={{ WebkitTextFillColor: "transparent" }}
          >
            콘텐츠의 진화
            <br aria-hidden="true" />
          </span>
          <span className="text-[#101828]">당신의 반응이</span>
          <span className="text-[#101828]">{` 완성합니다.`}</span>
        </p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start pb-[14.9px] pt-0 px-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4a5565] text-[21px] text-center w-full">
        <p className="block leading-[34.13px]">
          AI가 실시간 데이터를 분석하여 가장 트렌디한 콘텐츠를 만들고,
          <br aria-hidden="true" />
          {`모든 SNS 채널의 반응을 하나로 모아 분석합니다. `}
          <br aria-hidden="true" />
          그리고 당신의 반응을 학습해 스스로 진화하는 콘텐츠, 이제 직접
          경험하세요.
        </p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div
      className="box-border content-stretch flex flex-row h-[73px] items-center justify-center overflow-clip pb-[5.75px] pt-[4.25px] px-7 relative rounded-[14px] shadow-[10px_10px_4px_-2px_rgba(0,0,0,0.18)] shrink-0 w-[270px]"
      data-name="Button"
    >
      <div
        className="bg-clip-text bg-gradient-to-r flex flex-col font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold from-[#fffbfb] h-[47px] justify-center leading-[0] not-italic relative shrink-0 text-[31.5px] text-center to-[#eee389] w-[257px]"
        style={{ WebkitTextFillColor: "transparent" }}
      >
        <p className="block leading-[39.38px]">시작하기</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[20.1px] items-center justify-start max-w-[784px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Heading1 />
      <Container />
      <Button />
    </div>
  );
}

function Ai() {
  return (
    <div
      className="bg-no-repeat bg-size-[100%_100%] bg-top-left h-[453.75px] max-w-[784px] rounded-[14px] shrink-0 w-full"
      data-name="AI 소셜미디어 대시보드"
      style={{ backgroundImage: `url('${imgAi}')` }}
    />
  );
}

function BackgroundBorderShadow() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-[21px] shrink-0 w-full"
      data-name="Background+Border+Shadow"
    >
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-start p-[29px] relative w-full">
          <Ai />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute border border-gray-100 border-solid inset-0 pointer-events-none rounded-[21px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
      />
    </div>
  );
}

function Container2() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start max-w-[784px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <BackgroundBorderShadow />
    </div>
  );
}

function Container3() {
  return (
    <div
      className="max-w-[1008px] relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="max-w-inherit relative size-full">
        <div className="box-border content-stretch flex flex-col gap-14 items-start justify-start max-w-inherit px-28 py-0 relative w-full">
          <Container1 />
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Section() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 overflow-auto pb-28 pt-[110.815px] px-[216px] right-0 top-[57px]"
      data-name="Section"
    >
      <Container3 />
    </div>
  );
}

function Heading2() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#101828] text-[31.5px] text-center w-full">
        <p className="block leading-[35px]">시작하는 법</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start max-w-[588px] p-0 relative shrink-0 w-[588px]"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4a5565] text-[17.5px] text-center text-nowrap">
        <p className="block leading-[24.5px] whitespace-pre">
          당신의 반응으로 콘텐츠가 진화하는 3단계
        </p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3.5 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Heading2 />
      <Container4 />
    </div>
  );
}

function Component() {
  return (
    <div
      className="bg-no-repeat bg-size-[100%_100%] bg-top-left h-[336px] max-w-[448px] rounded-[21px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-full"
      data-name="플랫폼 연결하기"
      style={{ backgroundImage: `url('${img}')` }}
    />
  );
}

function BackgroundShadow() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row items-center justify-center overflow-clip pb-[5.75px] pt-[4.25px] px-0 relative rounded-[12.75px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 size-[35px]"
      data-name="Background+Shadow"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[7.9px] text-center text-neutral-950 text-nowrap">
        <p className="block leading-[24.5px] whitespace-pre">📱</p>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-[35px] items-start justify-start pl-0 pr-[7px] py-0 relative shrink-0 w-[42px]"
      data-name="Margin"
    >
      <BackgroundShadow />
    </div>
  );
}

function BackgroundShadow1() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row items-center justify-center overflow-clip pb-[5.75px] pt-[4.25px] px-0 relative rounded-[12.75px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 size-[35px]"
      data-name="Background+Shadow"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[7.9px] text-center text-neutral-950 text-nowrap">
        <p className="block leading-[24.5px] whitespace-pre">🎥</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-[35px] items-start justify-start pl-0 pr-[7px] py-0 relative shrink-0 w-[42px]"
      data-name="Margin"
    >
      <BackgroundShadow1 />
    </div>
  );
}

function BackgroundShadow2() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row items-center justify-center overflow-clip pb-[5.75px] pt-[4.25px] px-0 relative rounded-[12.75px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 size-[35px]"
      data-name="Background+Shadow"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[7.9px] text-center text-neutral-950 text-nowrap">
        <p className="block leading-[24.5px] whitespace-pre">📸</p>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-[35px] items-start justify-start pl-0 pr-[7px] py-0 relative shrink-0 w-[42px]"
      data-name="Margin"
    >
      <BackgroundShadow2 />
    </div>
  );
}

function BackgroundShadow3() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row items-center justify-center overflow-clip pb-[5.75px] pt-[4.25px] px-0 relative rounded-[12.75px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 size-[35px]"
      data-name="Background+Shadow"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[7.9px] text-center text-neutral-950 text-nowrap">
        <p className="block leading-[24.5px] whitespace-pre">🐦</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row items-start justify-start left-3.5 p-0 top-3.5 w-[161px]"
      data-name="Container"
    >
      <Margin />
      <Margin1 />
      <Margin2 />
      <BackgroundShadow3 />
    </div>
  );
}

function Container7() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Container"
    >
      <Component />
      <Container6 />
    </div>
  );
}

function Container8() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div
        className="bg-clip-text flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[49.731px] text-left text-nowrap"
        style={{ WebkitTextFillColor: "transparent" }}
      >
        <p className="block leading-[52.5px] whitespace-pre">01</p>
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 3"
    >
      <div className="flex flex-col font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#101828] text-[26.3px] text-left w-full">
        <p className="block leading-[31.5px]">모든 것을 하나로</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pb-0 pt-px px-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[25.59px] not-italic relative shrink-0 text-[#4a5565] text-[15.8px] text-left w-full">
        <p className="block mb-0">{`흩어진 당신의 모든 소셜 미디어를 하나의 연결로 통합하세요. `}</p>
        <p className="block">더 이상 복잡하게 관리할 필요가 없습니다.</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-5 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Container"
    >
      <Container8 />
      <Heading3 />
      <Container9 />
    </div>
  );
}

function Container11() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-14 items-center justify-center p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container7 />
      <Container10 />
    </div>
  );
}

function Container12() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div
        className="bg-clip-text flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[44.399px] text-left text-nowrap"
        style={{ WebkitTextFillColor: "transparent" }}
      >
        <p className="block leading-[52.5px] whitespace-pre">02</p>
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 3"
    >
      <div className="flex flex-col font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#101828] text-[26.3px] text-left w-full">
        <p className="block leading-[31.5px]">콘텐츠의 학습</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pb-0 pt-px px-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[25.59px] not-italic relative shrink-0 text-[#4a5565] text-[15.8px] text-left w-full">
        <p className="block mb-0">{`업로드된 콘텐츠의 모든 반응이 데이터가 됩니다. `}</p>
        <p className="block mb-0">{`AI가 이 데이터를 분석하고 학습하여, `}</p>
        <p className="block">
          당신의 콘텐츠가 나아갈 가장 효과적인 방향을 제시합니다.
        </p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-5 grow items-start justify-start min-h-px min-w-px order-2 p-0 relative shrink-0"
      data-name="Container"
    >
      <Container12 />
      <Heading5 />
      <Container13 />
    </div>
  );
}

function Ai1() {
  return (
    <div
      className="bg-no-repeat bg-size-[100%_100%] bg-top-left h-[336px] max-w-[448px] rounded-[21px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-full"
      data-name="AI 콘텐츠 분석"
      style={{ backgroundImage: `url('${imgAi1}')` }}
    />
  );
}

function BackgroundShadow4() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row items-center justify-center overflow-clip pb-[5.75px] pt-[4.25px] px-0 relative rounded-[12.75px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 size-[35px]"
      data-name="Background+Shadow"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[7.9px] text-center text-neutral-950 text-nowrap">
        <p className="block leading-[24.5px] whitespace-pre">📊</p>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-[35px] items-start justify-start pl-0 pr-[7px] py-0 relative shrink-0 w-[42px]"
      data-name="Margin"
    >
      <BackgroundShadow4 />
    </div>
  );
}

function BackgroundShadow5() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row items-center justify-center overflow-clip pb-[5.75px] pt-[4.25px] px-0 relative rounded-[12.75px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 size-[35px]"
      data-name="Background+Shadow"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[7.9px] text-center text-neutral-950 text-nowrap">
        <p className="block leading-[24.5px] whitespace-pre">🧠</p>
      </div>
    </div>
  );
}

function Margin4() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-[35px] items-start justify-start pl-0 pr-[7px] py-0 relative shrink-0 w-[42px]"
      data-name="Margin"
    >
      <BackgroundShadow5 />
    </div>
  );
}

function BackgroundShadow6() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row items-center justify-center overflow-clip pb-[5.75px] pt-[4.25px] px-0 relative rounded-[12.75px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 size-[35px]"
      data-name="Background+Shadow"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[7.9px] text-center text-neutral-950 text-nowrap">
        <p className="block leading-[24.5px] whitespace-pre">💬</p>
      </div>
    </div>
  );
}

function Margin5() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-[35px] items-start justify-start pl-0 pr-[7px] py-0 relative shrink-0 w-[42px]"
      data-name="Margin"
    >
      <BackgroundShadow6 />
    </div>
  );
}

function BackgroundShadow7() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row items-center justify-center overflow-clip pb-[5.75px] pt-[4.25px] px-0 relative rounded-[12.75px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 size-[35px]"
      data-name="Background+Shadow"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[15.8px] text-center text-neutral-950 text-nowrap">
        <p className="block leading-[24.5px] whitespace-pre">❤️</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row items-start justify-start left-3.5 p-0 top-3.5 w-[161px]"
      data-name="Container"
    >
      <Margin3 />
      <Margin4 />
      <Margin5 />
      <BackgroundShadow7 />
    </div>
  );
}

function Container16() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px order-1 p-0 relative shrink-0"
      data-name="Container"
    >
      <Ai1 />
      <Container15 />
    </div>
  );
}

function Container17() {
  return (
    <div
      className="box-border content-stretch flex flex-row-reverse gap-14 items-center justify-center p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container14 />
      <Container16 />
    </div>
  );
}

function Component1() {
  return (
    <div
      className="bg-no-repeat bg-size-[100%_100%] bg-top-left h-[336px] max-w-[448px] rounded-[21px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-full"
      data-name="자동 생성 및 발행"
      style={{ backgroundImage: `url('${img1}')` }}
    />
  );
}

function BackgroundShadow8() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row items-center justify-center overflow-clip pb-[5.75px] pt-[4.25px] px-0 relative rounded-[12.75px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 size-[35px]"
      data-name="Background+Shadow"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12.961px] text-center text-neutral-950 text-nowrap">
        <p className="block leading-[24.5px] whitespace-pre">✨</p>
      </div>
    </div>
  );
}

function Margin6() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-[35px] items-start justify-start pl-0 pr-[7px] py-0 relative shrink-0 w-[42px]"
      data-name="Margin"
    >
      <BackgroundShadow8 />
    </div>
  );
}

function BackgroundShadow9() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row items-center justify-center overflow-clip pb-[5.75px] pt-[4.25px] px-0 relative rounded-[12.75px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 size-[35px]"
      data-name="Background+Shadow"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[7.9px] text-center text-neutral-950 text-nowrap">
        <p className="block leading-[24.5px] whitespace-pre">🚀</p>
      </div>
    </div>
  );
}

function Margin7() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-[35px] items-start justify-start pl-0 pr-[7px] py-0 relative shrink-0 w-[42px]"
      data-name="Margin"
    >
      <BackgroundShadow9 />
    </div>
  );
}

function BackgroundShadow10() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row items-center justify-center overflow-clip pb-[5.75px] pt-[4.25px] px-0 relative rounded-[12.75px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 size-[35px]"
      data-name="Background+Shadow"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[7.9px] text-center text-neutral-950 text-nowrap">
        <p className="block leading-[24.5px] whitespace-pre">⏰</p>
      </div>
    </div>
  );
}

function Margin8() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-[35px] items-start justify-start pl-0 pr-[7px] py-0 relative shrink-0 w-[42px]"
      data-name="Margin"
    >
      <BackgroundShadow10 />
    </div>
  );
}

function BackgroundShadow11() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row items-center justify-center overflow-clip pb-[5.75px] pt-[4.25px] px-0 relative rounded-[12.75px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 size-[35px]"
      data-name="Background+Shadow"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[7.9px] text-center text-neutral-950 text-nowrap">
        <p className="block leading-[24.5px] whitespace-pre">📈</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row items-start justify-start left-3.5 p-0 top-3.5 w-[161px]"
      data-name="Container"
    >
      <Margin6 />
      <Margin7 />
      <Margin8 />
      <BackgroundShadow11 />
    </div>
  );
}

function Container19() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Container"
    >
      <Component1 />
      <Container18 />
    </div>
  );
}

function Container20() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div
        className="bg-clip-text flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[43.374px] text-left text-nowrap"
        style={{ WebkitTextFillColor: "transparent" }}
      >
        <p className="block leading-[52.5px] whitespace-pre">03</p>
      </div>
    </div>
  );
}

function Heading6() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 3"
    >
      <div className="flex flex-col font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#101828] text-[26.3px] text-left w-full">
        <p className="block leading-[31.5px]">스스로의 진화</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[25.59px] not-italic relative shrink-0 text-[#4a5565] text-[15.8px] text-left w-full">
        <p className="block mb-0">{`AI가 가장 매력적인 콘텐츠를 만들고, `}</p>
        <p className="block mb-0">{`최적의 타이밍에 발행하는 순간을 찾아냅니다. `}</p>
        <p className="block">
          이제 콘텐츠는 스스로 가장 완벽한 순간에 세상에 나갑니다.
        </p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-5 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Container"
    >
      <Container20 />
      <Heading6 />
      <Container21 />
    </div>
  );
}

function Container23() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-14 items-center justify-center p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container19 />
      <Container22 />
    </div>
  );
}

function Container24() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[70px] items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container11 />
      <Container17 />
      <Container23 />
    </div>
  );
}

function Container25() {
  return (
    <div
      className="max-w-[1008px] relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="max-w-inherit relative size-full">
        <div className="box-border content-stretch flex flex-col gap-14 items-start justify-start max-w-inherit px-7 py-0 relative w-full">
          <Container5 />
          <Container24 />
        </div>
      </div>
    </div>
  );
}

function Section1() {
  return (
    <div
      className="absolute bg-gradient-to-b box-border content-stretch flex flex-col from-[#ffffff] items-start justify-start left-0 overflow-auto px-[216px] py-[70px] right-0 to-[#ebf8f8] top-[1139.25px]"
      data-name="Section"
    >
      <Container25 />
    </div>
  );
}

function Heading7() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#101828] text-[31.5px] text-center w-full">
        <p className="block leading-[35px]">소셜 미디어, 이제 더 똑똑하게.</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start max-w-[588px] p-0 relative shrink-0 w-[588px]"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4a5565] text-[17.5px] text-center text-nowrap">
        <p className="block leading-[24.5px] whitespace-pre">
          당신의 아이디어를 세상에 내보내고, 모든 반응을 배우고, 스스로 진화하는
          가장 완벽한 방법입니다.
        </p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3.5 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Heading7 />
      <Container26 />
    </div>
  );
}

function Component2() {
  return (
    <div
      className="bg-left bg-no-repeat bg-size-[100%_106.66%] h-[168px] max-w-[298.66px] shrink-0 w-full"
      data-name="분석 대시보드"
      style={{ backgroundImage: `url('${img2}')` }}
    />
  );
}

function BackgroundShadow12() {
  return (
    <div
      className="absolute bg-[#ffffff] box-border content-stretch flex flex-row items-center justify-center left-3.5 overflow-clip pb-[7.5px] pt-[6.5px] px-0 rounded-[14px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[42px] top-3.5"
      data-name="Background+Shadow"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[10.5px] text-center text-neutral-950 text-nowrap">
        <p className="block leading-[28px] whitespace-pre">📊</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start order-2 p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Component2 />
      <BackgroundShadow12 />
    </div>
  );
}

function Heading8() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 3"
    >
      <div className="flex flex-col font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#101828] text-[17.5px] text-left w-full">
        <p className="block leading-[24.5px]">깊이 있는 인사이트</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[22.75px] not-italic relative shrink-0 text-[#4a5565] text-[14px] text-left w-full">
        <p className="block mb-0">{`모든 채널의 데이터를 통합 분석해 `}</p>
        <p className="block mb-0">{`콘텐츠 속 숨겨진 가치를 발견합니다. `}</p>
        <p className="block">
          AI가 제시하는 인사이트로 다음 콘텐츠를 위한 가장 스마트한 결정을
          내리세요.
        </p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="order-1 relative shrink-0 w-full" data-name="Container">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-[9.75px] items-start justify-start pb-[21px] pt-7 px-7 relative w-full">
          <Heading8 />
          <Container29 />
        </div>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-col-reverse gap-[21px] items-start justify-start overflow-clip p-0 relative rounded-[21px] self-stretch shrink-0 w-[298.66px]"
      data-name="Background"
    >
      <Container28 />
      <Container30 />
    </div>
  );
}

function Ai2() {
  return (
    <div
      className="bg-left bg-no-repeat bg-size-[100%_106.67%] h-[168px] max-w-[298.67px] shrink-0 w-full"
      data-name="AI 미디어 생성"
      style={{ backgroundImage: `url('${imgAi2}')` }}
    />
  );
}

function BackgroundShadow13() {
  return (
    <div
      className="absolute bg-[#ffffff] box-border content-stretch flex flex-row items-center justify-center left-3.5 overflow-clip pb-[7.5px] pt-[6.5px] px-0 rounded-[14px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[42px] top-3.5"
      data-name="Background+Shadow"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[10.5px] text-center text-neutral-950 text-nowrap">
        <p className="block leading-[28px] whitespace-pre">🎨</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start order-2 p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Ai2 />
      <BackgroundShadow13 />
    </div>
  );
}

function Heading9() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 3"
    >
      <div className="flex flex-col font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#101828] text-[17.5px] text-left w-full">
        <p className="block leading-[24.5px]">이야기의 시작</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[22.75px] not-italic relative shrink-0 text-[#4a5565] text-[14px] text-left w-full">
        <p className="block mb-0">{`각 플랫폼에 최적화된 콘텐츠를 `}</p>
        <p className="block mb-0">{`AI가 직접 생성합니다. `}</p>
        <p className="block">
          당신의 이야기가 가장 높은 참여를 이끌어낼 수 있도록 지능적인 콘텐츠를
          만듭니다.
        </p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="order-1 relative shrink-0 w-full" data-name="Container">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-[9.75px] items-start justify-start pb-[21px] pt-7 px-7 relative w-full">
          <Heading9 />
          <Container32 />
        </div>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-col-reverse gap-[21px] items-start justify-start overflow-clip p-0 relative rounded-[21px] self-stretch shrink-0 w-[298.67px]"
      data-name="Background"
    >
      <Container31 />
      <Container33 />
    </div>
  );
}

function Component3() {
  return (
    <div
      className="bg-[49.98%_50%] bg-no-repeat bg-size-[100%_106.66%] h-[168px] max-w-[298.66px] shrink-0 w-full"
      data-name="자동 발행"
      style={{ backgroundImage: `url('${img3}')` }}
    />
  );
}

function BackgroundShadow14() {
  return (
    <div
      className="absolute bg-[#ffffff] box-border content-stretch flex flex-row items-center justify-center left-3.5 overflow-clip pb-[7.5px] pt-[6.5px] px-0 rounded-[14px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[42px] top-3.5"
      data-name="Background+Shadow"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[10.5px] text-center text-neutral-950 text-nowrap">
        <p className="block leading-[28px] whitespace-pre">🚀</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start order-2 p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Component3 />
      <BackgroundShadow14 />
    </div>
  );
}

function Heading10() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 3"
    >
      <div className="flex flex-col font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#101828] text-[17.5px] text-left w-full">
        <p className="block leading-[24.5px]">완벽한 타이밍</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[22.75px] not-italic relative shrink-0 text-[#4a5565] text-[14px] text-left w-full">
        <p className="block mb-0">{`콘텐츠는 스스로 가장 많은 참여를 얻을 `}</p>
        <p className="block mb-0">{`최적의 시간을 압니다. `}</p>
        <p className="block mb-0">{`AI가 그 완벽한 순간에 맞춰 자동으로 `}</p>
        <p className="block">발행하여 최고의 효과를 이끌어냅니다.</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="order-1 relative shrink-0 w-full" data-name="Container">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-[9.75px] items-start justify-start pb-[21px] pt-7 px-7 relative w-full">
          <Heading10 />
          <Container35 />
        </div>
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-col-reverse gap-[21px] items-start justify-start overflow-clip p-0 relative rounded-[21px] self-stretch shrink-0 w-[298.65px]"
      data-name="Background"
    >
      <Container34 />
      <Container36 />
    </div>
  );
}

function Container37() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-7 items-start justify-center p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Background />
      <Background1 />
      <Background2 />
    </div>
  );
}

function Container38() {
  return (
    <div
      className="max-w-[1008px] relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="max-w-inherit relative size-full">
        <div className="box-border content-stretch flex flex-col gap-14 items-start justify-start max-w-inherit px-7 py-0 relative w-full">
          <Container27 />
          <Container37 />
        </div>
      </div>
    </div>
  );
}

function Section2() {
  return (
    <div
      className="absolute bg-gradient-to-b box-border content-stretch flex flex-col from-[#ebf9f9] items-start justify-start left-0 overflow-auto px-[216px] py-[70px] right-0 to-[#faf5ff] top-[2556.75px]"
      data-name="Section"
    >
      <Container38 />
    </div>
  );
}

function Container39() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[13.781px] text-left text-nowrap">
        <p className="block leading-[21px] whitespace-pre">AI</p>
      </div>
    </div>
  );
}

function Background3() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative rounded-[12.75px] shrink-0 size-[35px]"
      data-name="Background"
    >
      <Container39 />
    </div>
  );
}

function Margin9() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-[35px] items-start justify-start pl-0 pr-[10.5px] py-0 relative shrink-0 w-[45.5px]"
      data-name="Margin"
    >
      <Background3 />
    </div>
  );
}

function Container40() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start min-w-[126px] p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[21px] text-left text-nowrap">
        <p className="block leading-[28px] whitespace-pre">콘텐츠부스트</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Margin9 />
      <Container40 />
    </div>
  );
}

function Container42() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start max-w-[392px] p-0 relative shrink-0 w-[321px]"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[14px] text-left text-nowrap">
        <p className="block leading-[21px] whitespace-pre">
          {`콘텐츠를 만들고, 분석하고, 성장시키는 모든 과정을 `}
          <br aria-hidden="true" />
          AI의 자동화를 통해 더 많은 이들에게 당신의 이야기가
          <br aria-hidden="true" />
          닿도록, AI가 모든 것을 도와줍니다.
        </p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <a
        className="[white-space-collapse:collapse] flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[0px] text-left text-nowrap"
        href="https://dun-walnut-76657867.figma.site/"
      >
        <p className="block cursor-pointer leading-[21px] text-[7px] whitespace-pre">
          📧
        </p>
      </a>
    </div>
  );
}

function Link() {
  return (
    <div
      className="bg-[#1e2939] box-border content-stretch flex flex-row items-center justify-center p-0 relative rounded-[12.75px] shrink-0 size-[35px]"
      data-name="Link"
    >
      <Container43 />
    </div>
  );
}

function LinkMargin() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-[35px] items-start justify-start pl-0 pr-3.5 py-0 relative shrink-0 w-[49px]"
      data-name="Link:margin"
    >
      <Link />
    </div>
  );
}

function Container44() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <a
        className="[white-space-collapse:collapse] flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[0px] text-left text-nowrap"
        href="https://dun-walnut-76657867.figma.site/"
      >
        <p className="block cursor-pointer leading-[21px] text-[7px] whitespace-pre">
          🐦
        </p>
      </a>
    </div>
  );
}

function Link1() {
  return (
    <div
      className="bg-[#1e2939] box-border content-stretch flex flex-row items-center justify-center p-0 relative rounded-[12.75px] shrink-0 size-[35px]"
      data-name="Link"
    >
      <Container44 />
    </div>
  );
}

function LinkMargin1() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-[35px] items-start justify-start pl-0 pr-3.5 py-0 relative shrink-0 w-[49px]"
      data-name="Link:margin"
    >
      <Link1 />
    </div>
  );
}

function Container45() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <a
        className="[white-space-collapse:collapse] flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[0px] text-left text-nowrap"
        href="https://dun-walnut-76657867.figma.site/"
      >
        <p className="block cursor-pointer leading-[21px] text-[7px] whitespace-pre">
          📱
        </p>
      </a>
    </div>
  );
}

function Link2() {
  return (
    <div
      className="bg-[#1e2939] box-border content-stretch flex flex-row items-center justify-center p-0 relative rounded-[12.75px] shrink-0 size-[35px]"
      data-name="Link"
    >
      <Container45 />
    </div>
  );
}

function Container46() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <LinkMargin />
      <LinkMargin1 />
      <Link2 />
    </div>
  );
}

function Container47() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[21px] items-start justify-start p-0 relative self-stretch shrink-0 w-[462px]"
      data-name="Container"
    >
      <Container41 />
      <Container42 />
      <Container46 />
    </div>
  );
}

function Heading4() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 4"
    >
      <div className="flex flex-col font-['Inter:Semi_Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-left w-full">
        <p className="block leading-[21px]">제품</p>
      </div>
    </div>
  );
}

function Item() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Item"
    >
      <a
        className="flex flex-col font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[0px] text-left w-full"
        href="https://dun-walnut-76657867.figma.site/"
      >
        <p className="block cursor-pointer leading-[21px] text-[14px]">기능</p>
      </a>
    </div>
  );
}

function Item1() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Item"
    >
      <a
        className="flex flex-col font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[0px] text-left w-full"
        href="https://dun-walnut-76657867.figma.site/"
      >
        <p className="block cursor-pointer leading-[21px] text-[14px]">
          요금제
        </p>
      </a>
    </div>
  );
}

function Item2() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Item"
    >
      <a
        className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[0px] text-left w-full"
        href="https://dun-walnut-76657867.figma.site/"
      >
        <p className="block cursor-pointer leading-[21px] text-[14px]">API</p>
      </a>
    </div>
  );
}

function Item3() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Item"
    >
      <a
        className="flex flex-col font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[0px] text-left w-full"
        href="https://dun-walnut-76657867.figma.site/"
      >
        <p className="block cursor-pointer leading-[21px] text-[14px]">연동</p>
      </a>
    </div>
  );
}

function List() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[10.5px] items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List"
    >
      <Item />
      <Item1 />
      <Item2 />
      <Item3 />
    </div>
  );
}

function Container48() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3.5 items-start justify-start p-0 relative self-stretch shrink-0 w-[217px]"
      data-name="Container"
    >
      <Heading4 />
      <List />
    </div>
  );
}

function Heading11() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 4"
    >
      <div className="flex flex-col font-['Inter:Semi_Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-left w-full">
        <p className="block leading-[21px]">지원</p>
      </div>
    </div>
  );
}

function Item4() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Item"
    >
      <a
        className="flex flex-col font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[0px] text-left w-full"
        href="https://dun-walnut-76657867.figma.site/"
      >
        <p className="block cursor-pointer leading-[21px] text-[14px]">
          도움말 센터
        </p>
      </a>
    </div>
  );
}

function Item5() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Item"
    >
      <a
        className="flex flex-col font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[0px] text-left w-full"
        href="https://dun-walnut-76657867.figma.site/"
      >
        <p className="block cursor-pointer leading-[21px] text-[14px]">
          문의하기
        </p>
      </a>
    </div>
  );
}

function Item6() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Item"
    >
      <a
        className="flex flex-col font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[0px] text-left w-full"
        href="https://dun-walnut-76657867.figma.site/"
      >
        <p className="block cursor-pointer leading-[21px] text-[14px]">
          개인정보처리방침
        </p>
      </a>
    </div>
  );
}

function Item7() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Item"
    >
      <a
        className="flex flex-col font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[0px] text-left w-full"
        href="https://dun-walnut-76657867.figma.site/"
      >
        <p className="block cursor-pointer leading-[21px] text-[14px]">
          서비스 약관
        </p>
      </a>
    </div>
  );
}

function List1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[10.5px] items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List"
    >
      <Item4 />
      <Item5 />
      <Item6 />
      <Item7 />
    </div>
  );
}

function Container49() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3.5 items-start justify-start p-0 relative self-stretch shrink-0 w-[217px]"
      data-name="Container"
    >
      <Heading11 />
      <List1 />
    </div>
  );
}

function Container50() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-7 items-start justify-center p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container47 />
      <Container48 />
      <Container49 />
    </div>
  );
}

function Container51() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[14px] text-left text-nowrap">
        <p className="block leading-[21px] whitespace-pre">
          © 2025 콘텐츠부스트. 모든 권리 보유.
        </p>
      </div>
    </div>
  );
}

function Margin10() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pb-0.5 pl-0 pr-[21px] pt-0 relative shrink-0"
      data-name="Margin"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[12.25px] text-left text-nowrap">
        <p className="block leading-[21px] whitespace-pre">
          📧 support@contentboost.ai
        </p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#99a1af] text-[11.594px] text-left text-nowrap">
        <p className="block leading-[21px] whitespace-pre">📞 02-1234-5678</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-end justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Margin10 />
      <Container52 />
    </div>
  );
}

function Container54() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-end justify-between p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container51 />
      <Container53 />
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pb-0 pt-[27px] px-0 relative shrink-0 w-full"
      data-name="HorizontalBorder"
    >
      <div
        aria-hidden="true"
        className="absolute border-[#1e2939] border-[1px_0px_0px] border-solid inset-0 pointer-events-none"
      />
      <Container54 />
    </div>
  );
}

function Container55() {
  return (
    <div
      className="max-w-[1008px] relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="max-w-inherit relative size-full">
        <div className="box-border content-stretch flex flex-col gap-[42px] items-start justify-start max-w-inherit px-7 py-0 relative w-full">
          <Container50 />
          <HorizontalBorder />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div
      className="absolute bg-[#101828] box-border content-stretch flex flex-col h-[342px] items-start justify-start left-0 overflow-auto px-[216px] py-14 right-0 top-[3169px]"
      data-name="Footer"
    >
      <Container55 />
    </div>
  );
}

function Container56() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[11.916px] text-left text-nowrap">
        <p className="block leading-[17.5px] whitespace-pre">AI</p>
      </div>
    </div>
  );
}

function Background4() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center pb-[5.25px] pt-[4.25px] px-0 relative rounded-[12.75px] shrink-0 size-7"
      data-name="Background"
    >
      <Container56 />
    </div>
  );
}

function Margin11() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-7 items-start justify-start pl-0 pr-[10.5px] py-0 relative shrink-0 w-[38.5px]"
      data-name="Margin"
    >
      <Background4 />
    </div>
  );
}

function Container57() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Semi_Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#101828] text-[17.5px] text-left text-nowrap">
        <p className="block leading-[24.5px] whitespace-pre">콘텐츠부스트</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Margin11 />
      <Container57 />
    </div>
  );
}

function Margin12() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pl-0 pr-7 py-0 relative shrink-0"
      data-name="Margin"
    >
      <Container58 />
    </div>
  );
}

function Link3() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Link"
    >
      <a
        className="[white-space-collapse:collapse] flex flex-col font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4a5565] text-[0px] text-left text-nowrap"
        href="https://dun-walnut-76657867.figma.site/#features"
      >
        <p
          className="block cursor-pointer leading-[21px] text-[14px] whitespace-pre"
          role="link"
          tabIndex="0"
        >
          기능
        </p>
      </a>
    </div>
  );
}

function LinkMargin2() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-center pl-0 pr-7 py-0 relative self-stretch shrink-0"
      data-name="Link:margin"
    >
      <Link3 />
    </div>
  );
}

function Link4() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Link"
    >
      <a
        className="[white-space-collapse:collapse] flex flex-col font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4a5565] text-[14px] text-left text-nowrap"
        href="https://dun-walnut-76657867.figma.site/#testimonials"
      >
        <p className="block cursor-pointer leading-[21px] whitespace-pre">
          후기
        </p>
      </a>
    </div>
  );
}

function LinkMargin3() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-center pl-0 pr-7 py-0 relative self-stretch shrink-0"
      data-name="Link:margin"
    >
      <Link4 />
    </div>
  );
}

function Link5() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative self-stretch shrink-0"
      data-name="Link"
    >
      <a
        className="[white-space-collapse:collapse] flex flex-col font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4a5565] text-[14px] text-left text-nowrap"
        href="https://dun-walnut-76657867.figma.site/#support"
      >
        <p className="block cursor-pointer leading-[21px] whitespace-pre">
          지원
        </p>
      </a>
    </div>
  );
}

function Nav() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start p-0 relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0"
      data-name="Nav"
    >
      <LinkMargin2 />
      <LinkMargin3 />
      <Link5 />
    </div>
  );
}

function Container59() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Margin12 />
      <Nav />
    </div>
  );
}

function Button1() {
  return (
    <div
      className="box-border content-stretch flex flex-row h-[31.5px] items-center justify-center pb-[7.5px] pt-1.5 px-3.5 relative rounded-[6.75px] shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Inter:Medium',_'Noto_Sans_KR:Regular',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#4a5565] text-[12.3px] text-center text-nowrap">
        <p className="block leading-[17.5px] whitespace-pre">로그인</p>
      </div>
    </div>
  );
}

function ButtonMargin() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-[31.5px] items-start justify-start pl-0 pr-3.5 py-0 relative shrink-0"
      data-name="Button:margin"
    >
      <Button1 />
    </div>
  );
}

function Button2() {
  return (
    <div
      className="box-border content-stretch flex flex-row h-[31.5px] items-center justify-center pb-[7.5px] pt-1.5 px-[21px] relative rounded-[12.75px] shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Inter:Medium',_'Noto_Sans_KR:Regular',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[12.3px] text-center text-nowrap">
        <p className="block leading-[17.5px] whitespace-pre">시작하기</p>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0"
      data-name="Container"
    >
      <ButtonMargin />
      <Button2 />
    </div>
  );
}

function Container61() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-[470.75px] h-14 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container59 />
      <Container60 />
    </div>
  );
}

function Header() {
  return (
    <div
      className="backdrop-blur backdrop-filter bg-[rgba(255,255,255,0.8)] box-border content-stretch flex flex-col items-start justify-start pb-px pointer-events-auto pt-0 px-[244px] sticky top-0"
      data-name="Header"
    >
      <div
        aria-hidden="true"
        className="absolute border-[0px_0px_1px] border-gray-100 border-solid inset-0 pointer-events-none"
      />
      <Container61 />
    </div>
  );
}

function Background5() {
  return (
    <div
      className="bg-[#ffffff] h-[3511px] min-h-[852px] relative shrink-0 w-[1440px]"
      data-name="Background"
    >
      <Section />
      <Section1 />
      <Section2 />
      <Footer />
      <div className="absolute inset-0 pointer-events-none">
        <Header />
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 overflow-clip p-0 top-0"
      data-name="Container"
    >
      <Background5 />
    </div>
  );
}

function Container63() {
  return (
    <div
      className="absolute h-[900px] left-[-0.34px] right-[0.34px] top-[0.42px]"
      data-name="Container"
    >
      <Container62 />
      <div className="absolute flex h-[650.566px] items-center justify-center left-[-191px] top-[105px] w-[625.977px]">
        <div className="flex-none rotate-[298.785deg]">
          <div
            className="blur-[51.2px] filter h-[438.912px] rounded-[460.8px] w-[501.165px]"
            data-name="Gradient+Blur"
          />
        </div>
      </div>
      <div className="absolute flex h-[737.987px] items-center justify-center left-[979.37px] top-[428px] w-[715.175px]">
        <div className="flex-none rotate-[298.785deg]">
          <div
            className="blur-[51.2px] filter h-[506.178px] rounded-[263.875px] w-[563.949px]"
            data-name="Gradient+Blur"
          />
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="bg-[#121212] relative size-full" data-name="landing">
      <Container63 />
    </div>
  );
}