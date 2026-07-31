import DatesHeader from "./components/DatesHeader";
import Schedule from "./components/Schedule";
import WeekNavigator from "./components/WeekNavigator";

function App() {
  return (
    <main className="antialiased w-fit px-12 py-16">
      <h1 className="mb-5 text-xl font-medium">Manager Schedule</h1>
      <WeekNavigator />
      <div>
        <DatesHeader />
        <Schedule />
      </div>
    </main>
  );
}

export default App;
