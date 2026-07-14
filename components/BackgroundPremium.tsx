export default function BackgroundPremium() {
  return (
    <>
      <div
        className="bg-gradient-animated absolute inset-0 -z-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(18,10,143,0.55), transparent 55%), radial-gradient(circle at 80% 0%, rgba(218,165,32,0.12), transparent 45%), linear-gradient(160deg, #0A0E27 0%, #120A8F 60%, #0A0E27 100%)",
        }}
      />

      <svg
        className="animate-float pointer-events-none absolute bottom-0 left-0 -z-10 w-full opacity-[0.07]"
        viewBox="0 0 1200 300"
        fill="none"
        preserveAspectRatio="xMidYMax slice"
      >
        <rect x="60" y="120" width="70" height="180" fill="#DAA520" />
        <rect x="150" y="70" width="90" height="230" fill="#DAA520" />
        <rect x="260" y="150" width="60" height="150" fill="#DAA520" />
        <rect x="520" y="40" width="100" height="260" fill="#DAA520" />
        <rect x="650" y="100" width="70" height="200" fill="#DAA520" />
        <rect x="850" y="90" width="85" height="210" fill="#DAA520" />
        <rect x="960" y="140" width="65" height="160" fill="#DAA520" />
        <rect x="1060" y="60" width="95" height="240" fill="#DAA520" />
      </svg>
    </>
  );
}