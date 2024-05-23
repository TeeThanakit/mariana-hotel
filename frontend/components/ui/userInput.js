export default function Inputfield(props) {
  return (
    <p className="my-2">
      <label>{props.title}</label>
      <input
        type={props.type}
        required
        className="border border-solid border-gray-300 p-2 mx-2"
        {...props}
      />
    </p>
  );
}
