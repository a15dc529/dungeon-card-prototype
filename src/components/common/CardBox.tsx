/**
 * カード表示用の共通UI。
 *
 * 手札、報酬カード、生成カード一覧、保管カード一覧など、
 * ほぼ全部この見た目で流用できる。
 */

type Props = {
  title: string;
  lines?: string[];
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export default function CardBox({
  title,
  lines = [],
  selected = false,
  disabled = false,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-40 rounded-xl border p-3 text-left shadow-sm transition ${selected ? "border-slate-900 ring-2 ring-slate-300" : "border-slate-300"} ${disabled ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-white hover:bg-slate-50"}`}
    >
      <div className="mb-2 font-bold">{title}</div>
      <div className="space-y-1 text-sm text-slate-700">
        {lines.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </button>
  );
}
