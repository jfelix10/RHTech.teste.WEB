import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'modal',
    imports: [FormsModule, CommonModule],
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.css'
})
export class ModalComponent implements OnInit, OnDestroy {
    @Input() id?: string;
    isOpen = false;
    private element: any;

    constructor(private modalService: ModalService, private el: ElementRef) {
        this.element = el.nativeElement;
    }

    ngOnInit() {
        // inicia fechando modal
        this.close();

        // faz com que a modal seja aberta de qualquer componente
        this.modalService.add(this);

        // mostra a modal dentro do body acima de tudo
        document.body.appendChild(this.element);

        // fecha a modal ao clicar no fundo
        //   this.element.addEventListener('click', (el: any) => {
        //       if (el.target.className === 'modal') {
        //           this.close();
        //       }
        //   });
    }

    // remove a modal complementamente
    ngOnDestroy() {
        this.modalService.remove(this);
        this.element.remove();
    }

    open() {
        this.element.style.display = 'block';
        document.body.classList.add('modal-open');
        this.isOpen = true;
    }

    close() {
        this.element.style.display = 'none';
        document.body.classList.remove('modal-open');
        this.isOpen = false;
    }
}
