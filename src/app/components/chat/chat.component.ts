import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})
export class ChatComponent implements OnInit {
  // tslint:disable-next-line:no-inferrable-types
  message: string = '';
  element: any;
   // tslint:disable-next-line:no-inferrable-types
  profilePhoto: string = '';
  constructor(public _chatService: ChatService) {
    this._chatService.loadingMessages().subscribe(
      () => {
        setTimeout( () => { this.element.scrollTop = this.element.scrollHeight; }, 20);
        }
    );
   }

  ngOnInit() {
    this.element = document.getElementById('app-mensajes');
  }
  send_message() {
    console.log(this.message);
    if (this.message.length === 0) {
      return;
    } else {
       this._chatService.addMessage(this.message).then(() => { console.log('message sent!'); this.message = ''; })
       .catch(() => console.error('message not sent'));
    }
  }
}
