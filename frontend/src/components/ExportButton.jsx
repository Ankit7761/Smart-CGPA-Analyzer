import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

const ExportButton = ({ targetId = "analytics-export" }) => {
  const handleExport = async () => {
    const el = document.getElementById(targetId);
    if (!el) { toast.error("Nothing to export"); return; }
    toast.loading("Generating PDF...", { id: "pdf" });
    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#0a0a14" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
      pdf.save("cgpa-analytics.pdf");
      toast.success("PDF exported!", { id: "pdf" });
    } catch { toast.error("Export failed", { id: "pdf" }); }
  };

  return (
    <button onClick={handleExport}
      className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all"
      style={{ background: "rgba(124,106,255,0.1)", border: "1px solid rgba(124,106,255,0.2)", color: "#9f8fff" }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,106,255,0.18)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,106,255,0.1)"; }}>
      ⬇ Export PDF
    </button>
  );
};

export default ExportButton;
