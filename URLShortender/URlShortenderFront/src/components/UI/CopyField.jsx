import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";

const CopyField = ({ label, value }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="copy-field">
      <label>{label}</label>
      <div className="copy-row">
        <Form.Control readOnly value={value} />
        <Button variant="outline-secondary" onClick={copy}>
          {copied ? "✔" : "Copy"}
        </Button>
      </div>
    </div>
  );
};

export default CopyField;
