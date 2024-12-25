
'use client'
import { useState } from "react";
import { FoodGrid } from "../components/food-grid";
import { Header } from "../components/header";

export default function Menu() {
  const [searchTerm, setSearchTerm] = useState<string>("");  // Gerenciar o estado de busca

    return (
        <div>
        <div>
          <main>
            <Header setSearchTerm={setSearchTerm} />
          </main>
        </div>
        <div className="container mx-auto px-4 py-8">
          <main className="flex-1 lg:ml-64">
           
          </main>
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Batatas recheadas</h2>
              <div className="flex space-x-2">
                <button className="text-orange-500 font-medium">Os mais pedidos</button>
                <button className="text-gray-500 font-medium">Todos</button>
              </div>
            </div>
            <FoodGrid searchTerm={searchTerm} /> {/* Passa searchTerm para o FoodGrid */}
          </div>
        </div>
      </div>
    )
}