interface PaperProps {
    children: React.ReactNode;
    className?: string;
}
export default function Paper({
    children,
    className = "",
}: PaperProps) {
    return (
        <div className={`bg-white rounded-3xl shadow-2xl border border-slate-200 p-10 ${className}`}>
            {children}
        </div>
    );
}
