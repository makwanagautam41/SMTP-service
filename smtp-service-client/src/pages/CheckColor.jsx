import React from "react";

const CheckColor = () => {
  const colors = [
    { name: "Primary", value: "#007BFF", usage: "Main buttons & highlights" },
    { name: "Primary Dark", value: "#0056D2", usage: "Hover states" },
    { name: "Primary Light", value: "#E6F0FF", usage: "Accent backgrounds" },
    { name: "Secondary", value: "#00B8D9", usage: "Icons & subtle accents" },
    { name: "Accent", value: "#FFD23F", usage: "Alerts or highlights" },
    { name: "Background", value: "#F8FAFC", usage: "Main background" },
    { name: "Surface", value: "#FFFFFF", usage: "Cards, modals" },
    { name: "Text Primary", value: "#1E293B", usage: "Main text" },
    { name: "Text Secondary", value: "#64748B", usage: "Subtle text" },
    { name: "Border", value: "#E2E8F0", usage: "Borders & dividers" },
    { name: "Success", value: "#16A34A", usage: "Success messages" },
    { name: "Error", value: "#DC2626", usage: "Error messages" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <h1 className="text-3xl font-bold text-[#1E293B] mb-6">
        🎨 SMTP-Lite Brand Colors
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {colors.map((color) => (
          <div
            key={color.name}
            className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white"
          >
            <div
              className="h-24 w-full"
              style={{ backgroundColor: color.value }}
            ></div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900">
                {color.name}
              </h3>
              <p className="text-sm text-gray-500">{color.value}</p>
              <p className="text-xs text-gray-400 mt-1">{color.usage}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Example Usage Section */}
      <div className="mt-10 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-[#1E293B] mb-4">
          Example UI Usage
        </h2>

        <div className="space-y-4">
          {/* Buttons */}
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-[#007BFF] text-white rounded-lg hover:bg-[#0056D2] transition">
              Primary Button
            </button>
            <button className="px-4 py-2 bg-[#00B8D9] text-white rounded-lg hover:bg-[#0098B9] transition">
              Secondary Button
            </button>
            <button className="px-4 py-2 bg-[#FFD23F] text-[#1E293B] rounded-lg hover:bg-[#FBBF24] transition">
              Accent Button
            </button>
          </div>

          {/* Card Example */}
          <div className="p-4 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC]">
            <h3 className="font-bold text-[#1E293B]">Sample Card</h3>
            <p className="text-[#64748B]">
              This area demonstrates the surface, text, and border colors in
              action.
            </p>
          </div>

          {/* Alert Examples */}
          <div className="space-y-2">
            <div className="p-3 rounded-md bg-[#E6F0FF] border-l-4 border-[#007BFF] text-[#1E293B]">
              ℹ️ Info: SMTP-Lite provides reliable email delivery.
            </div>
            <div className="p-3 rounded-md bg-[#DCFCE7] border-l-4 border-[#16A34A] text-[#166534]">
              ✅ Success: Your message was sent successfully.
            </div>
            <div className="p-3 rounded-md bg-[#FEE2E2] border-l-4 border-[#DC2626] text-[#991B1B]">
              ❌ Error: Something went wrong, please try again.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckColor;
