import classes from "../css/appPage.module.css";
import MainNavigator from "@/components/main-navbar";

export default function HomePage() {
  return (
    <>
      <MainNavigator />
      <div className={classes.bedroom}>
        <div className={classes.content}>
          <h1 className="text-7xl uppercase">
            Escape the ordinary indulge in the extraordinary
          </h1>
          <p className="pt-3 text-2xl">Welcome to your oasis of luxury at</p>
        </div>
      </div>
    </>
  );
}
