import { Ellipsis, Default } from "react-spinners-css";

export function CircleAnimation(loading: boolean, size?: number) {
  if (loading) {
    return (
      <div className="loader">
        <Default color="rgb(219, 11, 21)" size={size || 80} />
      </div>
    );
  }
}

export function loaderAnimation(loading: boolean, size?: number) {
  if (loading) {
    return (
      <div className="loader">
        <Ellipsis color="rgb(219, 11, 21)" size={size || 80} />
      </div>
    );
  }
}
