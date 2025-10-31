import { Theme } from "@radix-ui/themes";
import Home from "./pages/Home";

export default function App() {
  return (
    <Theme>
      <div className="min-h-screen bg-gray-100 text-gray-900 overflow-hidden flex flex-col">
        <main className="mx-auto p-4 flex flex-auto w-full">
          <Home />
        </main>
      </div>
    </Theme>
  );
}
