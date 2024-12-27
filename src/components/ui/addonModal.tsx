import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface Addon {
  id: string
  name: string
  price: number
}

interface AddOnsModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedAddons: Addon[]) => void
  addons: Addon[]
  itemName: string
}

export function AddOnsModal({ isOpen, onClose, onConfirm, addons, itemName }: AddOnsModalProps) {
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([])

  const handleAddonToggle = (addon: Addon) => {
    setSelectedAddons(prev => 
      prev.some(a => a.id === addon.id)
        ? prev.filter(a => a.id !== addon.id)
        : [...prev, addon]
    )
  }

  const handleConfirm = () => {
    onConfirm(selectedAddons)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add-ons for {itemName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {addons.map((addon) => (
            <div key={addon.id} className="flex items-center space-x-2">
              <Checkbox
                id={addon.id}
                checked={selectedAddons.some(a => a.id === addon.id)}
                onCheckedChange={() => handleAddonToggle(addon)}
              />
              <Label htmlFor={addon.id} className="flex-grow">{addon.name}</Label>
              <span className="text-sm text-gray-500">${addon.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Add to Cart</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
