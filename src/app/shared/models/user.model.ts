import {IScapholdUser} from '../services/auth.service';
/**
 * Created by Tobia on 12/04/17.
 */
export class User implements IScapholdUser {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string;
  createdAt: Date;
  modifiedAt: Date;
  lastLogin: Date;

}
