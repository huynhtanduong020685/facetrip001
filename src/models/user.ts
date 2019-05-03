export class User{
    public name: string = '';
    public email: string ='';
    public picture: string = '';
    public languages: Array<string>  = [];
    public location: object = {
        country: '',
        city: ''
    };
    public guide_fee: string = '';
    public meet_at_airport: boolean = false;
    public introduciton: string ='';
    public facebook: string ='';
    public messenger: string ='';
    
    constructor(){
        
    }
}