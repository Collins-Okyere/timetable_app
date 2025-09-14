import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeWords',
  standalone: true
})
export class CapitalizeWordsPipe implements PipeTransform {

  transform(value: any): string {
    if (value === null || value === undefined) return '';
    
    // If it's an array, join and convert it to a string
    if (Array.isArray(value)) {
      value = value.map((v: any) => String(v).replace(/_/g, ' '))
                   .map((v: string) => this.capitalize(v))
                   .join(', ');
      return value;
    }

    const strVal = String(value);
    const withSpaces = strVal.replace(/_/g, ' ');
    return this.capitalize(withSpaces);
  }

  private capitalize(text: string): string {
    return text
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camelCase
      .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letters
  }
}
