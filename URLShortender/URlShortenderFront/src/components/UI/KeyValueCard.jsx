import Card from "./Card";
import CopyField from "./CopyField";

const KeyValueCard = ({ title, items }) => {
  if (!items?.length) return null;

  return (
    <Card>
      {title && <h3 className="text-center mb-3">{title}</h3>}

      {items.map(({ label, value, copy }, idx) =>
        copy ? (
          <CopyField key={idx} label={label} value={value}/>
        ) : (
          <div key={idx}>
            <strong>{label}:</strong> {value}
          </div>
        )
      )}
    </Card>
  );
};

export default KeyValueCard;
