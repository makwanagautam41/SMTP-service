import { Link } from "react-router-dom";
import React from "react";

const EmailTemplate = () => {
  return (
    <div>
      EmailTemplate
      <p>
        <Link to={"/create-template"}>Create new template</Link>
      </p>
    </div>
  );
};

export default EmailTemplate;
