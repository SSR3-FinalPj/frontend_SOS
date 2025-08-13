import ConnectYouTubeButton from "../components/ui/ConnectYouTubeButton";

export default function SettingsYouTube() {
  const onDone = () => {
    // 성공 후 추가 액션 필요하면 여기서
  };
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">YouTube 연동</h2>
      <ConnectYouTubeButton onDone={onDone} />
    </div>
  );
}
