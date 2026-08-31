import { savePDF } from "@progress/kendo-react-pdf";

class DocService {
  createPdf = (html) => {
    savePDF(html, {
      paperSize: "A4",
      fileName: "siteVis.pdf",
      margin: 3,
      forcePageBreak: ".page-break",
      // defineFont: styles.font
    });
  };
}

const Doc = new DocService();
export default Doc;
