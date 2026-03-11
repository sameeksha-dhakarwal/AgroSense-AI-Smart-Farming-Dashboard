import {
  Sprout,
  Leaf,
  Bug,
  Droplets,
  Package,
  Wheat
} from "lucide-react";

const categories = [
  { name: "Seeds", icon: Sprout },
  { name: "Fertilizers", icon: Leaf },
  { name: "Pesticides", icon: Bug },
  { name: "Herbicides", icon: Droplets },
  { name: "Equipment", icon: Package },
  { name: "Organic", icon: Wheat }
];

export default function CategoryGrid({ setCategory }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">

      {categories.map(({ name, icon: Icon }) => (
        <button
          key={name}
          onClick={() => setCategory(name)}
          className="bg-white border rounded-2xl p-6 flex flex-col items-center gap-2 hover:shadow"
        >
          <div className="bg-green-100 p-3 rounded-full">
            <Icon className="text-green-600" />
          </div>

          <span className="text-sm font-medium">
            {name}
          </span>
        </button>
      ))}

    </div>
  );
}