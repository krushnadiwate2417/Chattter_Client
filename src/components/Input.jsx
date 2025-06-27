export default function Input({ value, placeholder, type, setText }) {
  return (
    <input
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={(e) => setText(e.target.value)}
      className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
    />
  );
}
