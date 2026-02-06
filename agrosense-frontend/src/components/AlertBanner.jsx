export default function AlertBanner({ type, message }) {
  const styles = {
    danger: "bg-red-50 text-red-700 border-red-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };

  return (
    <div
      className={`border rounded-xl p-4 text-sm ${styles[type]}`}
    >
      🚨 {message}
    </div>
  );
}
