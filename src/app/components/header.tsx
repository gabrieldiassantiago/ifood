"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, Menu, Search, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCart } from "./providers/cart-provider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Cart } from "./cart";

interface HeaderProps {
  setSearchTerm: (term: string) => void; 
}

export function Header({ setSearchTerm }: HeaderProps) {
  const { items } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <header className="sticky top-0  z-50  w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center px-4 gap-4">
        {/* Menu Button */}
        <Button variant="ghost" size="icon" className="lg:hidden mr-2">
          <Menu className="h-6 w-6" />
        </Button>

        <div className="flex-1 flex items-center space-x-4">
        <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Pesquisar item"
              className="pl-8 bg-gray-50"
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
              <DropdownMenuItem>Rating: High to Low</DropdownMenuItem>
              <DropdownMenuItem>Delivery Time</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => setIsCartOpen(!isCartOpen)} 
          >
            <ShoppingCart className="h-4 w-4" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-orange-500 text-xs text-white flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Button>

          {/* Cart Dropdown */}
          {isCartOpen && (
            <div className="absolute right-0 mt-2 w-96 bg-white border rounded-lg shadow-lg z-50">
              <Cart /> {/* Display Cart component when isCartOpen is true */}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
