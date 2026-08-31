import React from "react";

export default (props) => {
  const bodyRef = React.createRef();
  const createPdf = () => props.createPdf(bodyRef.current);
  // const markAsComplet = () => props.createPdf();
  // const saveDoc = () => props.createPdf();
  return (
    <section className="pdf-container">
      <section className="pdf-body" ref={bodyRef}>
        {props.children}
      </section>
      <div className="pdf-toolbar">
        <section className=" filter-Button mrg40">
          <button className=" report " onClick={createPdf}>
            Create PDF
          </button>
        </section>
      </div>
    </section>
  );
};
