export default function LoadingSpinner() {
  return (
    <div className="w-screen z-50 h-screen fixed top-0 left-0 flex justify-center items-center">
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
