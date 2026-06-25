const footerLinks = ["Evidence Policy", "Device Health", "Audit Trail", "Support"];

export function DashboardFooter() {
  return (
    <footer className="flex flex-col gap-3 border-t border-borderSubtle pt-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <p>MoroAI Enterprise Security Center</p>
      <nav className="flex flex-wrap gap-4" aria-label="Dashboard footer">
        {footerLinks.map((link) => (
          <a key={link} href="#" className="transition hover:text-cyan-100">
            {link}
          </a>
        ))}
      </nav>
    </footer>
  );
}
