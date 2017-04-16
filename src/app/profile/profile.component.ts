import {Component, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';

import {Subscription} from 'rxjs/Subscription';

import gql from 'graphql-tag';
import {User} from '../shared/models/user.model';

const CurrentUserForProfile = gql`
  query User {
    viewer {
      user {
        username
      }
    }
  }
`;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  loading: boolean;
  currentUser: User = new User();
  private currentUserSub: Subscription;

  constructor(private apollo: Apollo) {
  }

  ngOnInit() {
    this.currentUserSub = this.apollo.watchQuery({
      query: CurrentUserForProfile
    }).subscribe(({data, loading}) => {
      this.loading = loading;
      console.log(data);
      this.currentUser = data['viewer']['user'];
    });
  }

}
