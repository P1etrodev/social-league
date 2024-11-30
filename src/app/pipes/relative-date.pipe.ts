import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeDate',
})
export class RelativeDatePipe implements PipeTransform {
  transform(date: string): unknown {
    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      return 'Fecha no válida';
    }

    const now = new Date().getTime();
    const difference = now - targetDate.getTime();

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      if (seconds > 1) return `hace ${seconds} segundos`;
      return `hace ${seconds} segundo`;
    } else if (minutes < 60) {
      if (minutes > 1) return `hace ${minutes} minutos`;
      return `hace ${minutes} minuto`;
    } else if (hours < 24) {
      if (hours > 1) return `hace ${hours} horas`;
      return `hace ${hours} hora`;
    } else if (days < 7) {
      if (days > 1) return `hace ${days} días`;
      return `hace ${days} día`;
    } else if (weeks < 4) {
      if (weeks > 1) return `hace ${weeks} semanas`;
      return `hace ${weeks} semana`;
    } else if (months < 12) {
      if (months > 1) return `hace ${months} meses`;
      return `hace ${months} mes`;
    } else {
      if (years > 1) return `hace ${years} años`;
      return `hace ${years} año`;
    }
  }
}
