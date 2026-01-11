import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Card from "./UI/Card";

const TextSubmit = ({title, value, onChange, onSubmit, loading = false, error = "", placeholder = "", 
  buttonText = "Submit", inputType = "text", children}) => {
  return (
    <Card>
      {title && <h3 className="text-center mb-3">{title}</h3>}

      <Form onSubmit={onSubmit} className="input-form">
        <Form.Control type={inputType} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}/>
        {children}
        <Button type="submit" disabled={loading}>
          {loading && (
            <Spinner as="span" size="sm" animation="border" className="me-2"/>
          )}
          {buttonText}
        </Button>
        {error && <div className="error">{error}</div>}
      </Form>
    </Card>
  );
};

export default TextSubmit;
