import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { WasteLevel } from '../../containers/container.entity'

export class OptimizeRouteDto {
  @IsNumber()
  startLat: number

  @IsNumber()
  startLng: number

  @IsNumber()
  endLat: number

  @IsNumber()
  endLng: number

  @IsString()
  city: string

  @IsArray()
  @IsEnum(WasteLevel, { each: true })
  @IsOptional()
  wasteTypes?: WasteLevel[]
}
