
export function get2CharacterOfFirstEarchWork(value: string): string {
    const trimmed = value?.trim();
  
    return trimmed? trimmed.split(/\s+/) // words
      .map(it => it[0].toUpperCase()) // initials
      .slice(-2) // last 2
      .join("") : "";
}

export function removeAccents(str: string): string {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D');
  }
  