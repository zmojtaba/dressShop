import { Component,OnChanges, Input, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.scss']
})
export class PasswordStrengthComponent implements OnChanges {
  bar0: string;
  bar1: string;
  bar2: string;
  bar3: string;
  bar4: string; 


  @Input() passwordToCheck: string;
  @Input() barLabel: string; 
  private colors = ['darkred', 'orangered', 'orange', 'yellowgreen'];

  private static checkStrength(p:string) {
    // 1
    let force = 0;
  
    // 2
    const regex = /[$-/:-?{-~!"^_@`\[\]]/g;
    const lowerLetters = /[a-z]+/.test(p);
    const upperLetters = /[A-Z]+/.test(p);
    const numbers = /[0-9]+/.test(p);
    const symbols = regex.test(p);
  
    // 3
    const flags = [lowerLetters, upperLetters, numbers, symbols];
  
    // 4
    let passedMatches = 0;
    for (const flag of flags) {
      passedMatches += flag === true ? 1 : 0;
    }
  
    // 5
    force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
    force += passedMatches * 10;
  
    // 6
    force = (p.length <= 8) ? Math.min(force, 10) : force;
  
    // 7
    force = (passedMatches === 1) ? Math.min(force, 10) : force;
    force = (passedMatches === 2) ? Math.min(force, 20) : force;
    force = (passedMatches === 3) ? Math.min(force, 30) : force;
    force = (passedMatches === 4) ? Math.min(force, 40) : force;
  
    return force;
  }

  private getColor(s:number) {
    let index = 0;
    if (s === 10) {
      index = 0;
    } else if (s === 20) {
      index = 1;
    } else if (s === 30) {
      index = 2;
    } else if (s === 40) {
      index = 3;
    } else {
      index = 4;
    }
    return {
      index: index + 1,
      color: this.colors[index]
    };
  }

  private setBarColors(count:any, col:any) {
    for (let n = 0; n < count; n++) {
      if (n===0){this.bar0=col}
      else if (n===1){
        this.bar1=col
    } else if (n===2){
      this.bar2=col
    }else if (n===3){
      this.bar3= col
    }
  }}



  ngOnChanges(changes: { [propName: string]: SimpleChange }){
    
    
    // const password = changes.passwordToCheck.currentValue;
    // this.setBarColors(4, '#DDD');
    // if (password) {
    //   const c = this.getColor(PasswordStrengthComponent.checkStrength(password));
    //   this.setBarColors(c.index, c.color);
    // }
  
  
  
  }

}
