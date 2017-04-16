import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import {ApolloCurrentResult} from 'apollo-client/core/ObservableQuery';
import {Apollo} from 'apollo-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {User} from '../models/user.model';

const AUTH_TOKEN_KEY = 'SCAPHOLD_AUTH_TOKEN';
const AUTH_ID_KEY = 'SCAPHOLD_AUTH_ID';
const AUTH_USER_KEY = 'SCAPHOLD_AUTH_USER';

export interface IScapholdCredential {
  id: string;
  token: string;
}

export interface IScapholdUserInput {
  username: string;
  email: string;
  password: string;
}

export interface IScapholdUser {
  username: string;
  email: string;
  createdAt: Date;
  modifiedAt: Date;
  lastLogin: Date;
}


@Injectable()
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User>(new User());
  public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();


  credential: IScapholdCredential;
  user: User;
  client: Apollo;

  constructor(private apollo: Apollo) {
    this.refresh();
    this.client = apollo;
  }

  private refresh() {
    this.credential = this.getCredential();
    this.user = this.getUser();
  }

  logout() {
    localStorage.clear();
    this.client.getClient().resetStore();
    this.currentUserSubject.next(new User());
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);

    // this.refresh();
  }

  login(user: IScapholdUserInput): Promise<ApolloCurrentResult<IScapholdUser>> {
    return this.client.getClient().mutate({
      mutation: gql`
        mutation LoginUser($input: LoginUserInput!) {
            loginUser(input: $input) {
                token
                user {
                  id
                  username
                  email
                  createdAt
                }
            }
        }
      `,
      variables: {
        input: {
          username: user.username,
          password: user.password
        }
      }
    }).then((result: ApolloCurrentResult<IScapholdUser>) => {
      const {data, error} = result;
      if (error) {
        throw error;
      }
      this.setCredential({token: data['loginUser']['token'], id: data['loginUser']['user']['id']});
      this.syncUser(data['loginUser']['user']['id']);
      this.setAuth(data['loginUser']['user']);
      return result;
    });
  }

  populate() {
    // If JWT detected, attempt to get & store user's info

    if (localStorage.getItem(AUTH_TOKEN_KEY) && this.getUser()) {
      const userID = this.getUser()['id'];
      this.syncUser(userID);
      this.setAuth(this.user);
    } else {
      // Remove any potential remnants of previous auth states
      this.logout();
    }
  }


  syncUser(id: string) {
    const subscription = this.client.getClient().watchQuery({
      query: gql`
        query GetUser($id: ID!) {
          getUser(id: $id) {
            id
            username
          }
        }
      `,
      variables: {
        id: id
      }
    }).subscribe({
      next: ((result: ApolloCurrentResult<IScapholdUser>) => {
        this.setUser(result.data['getUser']);
        subscription.unsubscribe();
      }).bind(this),
      error: ((error: Error) => {
        console.error(`Error getting user ${error.message}`);
        subscription.unsubscribe();
      }).bind(this)
    });
  }

  register(user: IScapholdUserInput): Promise<ApolloCurrentResult<IScapholdUser>> {
    return this.client.getClient().mutate({
      mutation: gql`
        mutation CreateUser($input: CreateUserInput!) {
          createUser(input: $input) {
            changedUser {
              id
              username
              email
              createdAt
              modifiedAt
              lastLogin
            }
          }
        }
      `,
      variables: {
        input: {
          username: user.username,
          email: user.email,
          password: user.password
        }
      }
    }).then((result: ApolloCurrentResult<IScapholdUser>) => {
      const {data, error} = result;
      if (error) {
        throw error;
      }
      this.setUser(data['createUser']['changedUser']);
      return result;
    });
  }

  private getCredential(): IScapholdCredential {
    const cred: any = {};
    cred.token = localStorage.getItem(AUTH_TOKEN_KEY);
    cred.id = localStorage.getItem(AUTH_ID_KEY);
    return cred;
  }

  private setCredential(cred: IScapholdCredential) {
    localStorage.setItem(AUTH_TOKEN_KEY, cred.token);
    localStorage.setItem(AUTH_ID_KEY, cred.id);
  }

  private getUser() {
    return JSON.parse(localStorage.getItem(AUTH_USER_KEY));
  }

  private setUser(user: User) {
    this.user = user;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }

  private setAuth(user: User) {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }
}
