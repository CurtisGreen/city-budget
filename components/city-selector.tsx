"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { CityData } from "@/lib/types"

interface CitySelectorProps {
  cities: CityData[]
  selectedCities: string[]
  onSelectionChange: (cityIds: string[]) => void
  maxSelections?: number
}

export function CitySelector({ cities, selectedCities, onSelectionChange, maxSelections = 4 }: CitySelectorProps) {
  const [open, setOpen] = useState(false)

  const toggleCity = (cityId: string) => {
    if (selectedCities.includes(cityId)) {
      onSelectionChange(selectedCities.filter((id) => id !== cityId))
    } else if (selectedCities.length < maxSelections) {
      onSelectionChange([...selectedCities, cityId])
    }
  }

  const selectedCityNames = cities
    .filter((city) => selectedCities.includes(city.info.id))
    .map((city) => city.info.name)
    .join(", ")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          {selectedCityNames || "Select cities..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search cities..." />
          <CommandList>
            <CommandEmpty>No city found.</CommandEmpty>
            <CommandGroup>
              {cities.map((city) => {
                const isSelected = selectedCities.includes(city.info.id)
                const isDisabled = !isSelected && selectedCities.length >= maxSelections

                return (
                  <CommandItem
                    key={city.info.id}
                    value={city.info.name}
                    onSelect={() => toggleCity(city.info.id)}
                    disabled={isDisabled}
                  >
                    <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                    {city.info.name}
                    <span className="ml-auto text-xs text-muted-foreground">
                      Pop: {(city.info.population / 1000).toFixed(0)}K
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
