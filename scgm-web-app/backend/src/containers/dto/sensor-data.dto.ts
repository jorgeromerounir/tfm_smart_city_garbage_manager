import { IsEnum, IsNumber, IsUUID, Max, Min } from 'class-validator'
import { WasteLevel } from '../container.entity'

export class SensorDataDto {
  @IsUUID()
  containerId: string

  @IsEnum(WasteLevel)
  wasteLevel: WasteLevel

  @IsNumber()
  @Min(-50)
  @Max(70)
  temperature: number
}
