import { useState } from 'react'
import { WasteLevel } from '../types'

export default function useWasteTypes() {
	const [selectedWasteTypes, setSelectedWasteTypes] = useState<WasteLevel[]>([
		WasteLevel.HEAVY,
		WasteLevel.MEDIUM,
	])

	return {
		selectedWasteTypes,
		setSelectedWasteTypes,
	}
}
