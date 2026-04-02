export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 결제 페이지는 body의 flex/overflow 제약에서 벗어나기 위해 독립 레이아웃 사용
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      overflow: "auto",
      background: "#f5f5f5",
      zIndex: 50,
    }}>
      {children}
    </div>
  );
}
