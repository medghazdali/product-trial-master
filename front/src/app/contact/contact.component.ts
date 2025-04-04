import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  messageLength: number = 0;
  readonly minMessageLength: number = 300;
  readonly warningThreshold: number = 250;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      message: ['', [
        Validators.required,
        Validators.minLength(this.minMessageLength)
      ]]
    });

    // Subscribe to message changes for real-time length tracking
    this.contactForm.get('message')?.valueChanges.subscribe(value => {
      this.messageLength = value?.length || 0;
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.contactForm.valid) {
      // Here you would typically send the form data to a backend service
      console.log('Form submitted:', this.contactForm.value);
      
      // Show success message
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Demande de contact envoyée avec succès'
      });

      // Reset form
      this.contactForm.reset();
      this.messageLength = 0;
    } else {
      // Mark all fields as touched to trigger validation display
      Object.keys(this.contactForm.controls).forEach(key => {
        const control = this.contactForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  // Helper methods for template
  isFieldInvalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(field: string): string {
    const control = this.contactForm.get(field);
    if (control) {
      if (control.hasError('required')) {
        return 'Ce champ est obligatoire';
      }
      if (control.hasError('email')) {
        return 'Veuillez entrer une adresse email valide';
      }
      if (control.hasError('minlength')) {
        return `Le message doit contenir au moins ${this.minMessageLength} caractères`;
      }
    }
    return '';
  }

  getMessageCounterClass(): string {
    if (this.messageLength >= this.minMessageLength) {
      return 'text-green-500';
    } else if (this.messageLength >= this.warningThreshold) {
      return 'text-yellow-500';
    }
    return 'text-red-500';
  }
} 