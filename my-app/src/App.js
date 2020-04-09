import React, {Component} from 'react';
//import logo from './logo.svg';
import './App.css';
import NavbarIdx from './navbar';
import HomePage from './homepage';
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import DetailedPage from './detailedpage.js';
import BookmarkPage from './bookmarkpage.js';
import SearchPage from './searchpage.js';

var dKey = 0;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      whichPage: 'home/',
      source: 'guardian',
      isLoaded: false, 
      pageContent: [],
      apiHost: 'http://kxue-nodejs.us-east-1.elasticbeanstalk.com/',
      routes: []
    };
    this.updateNewsSource = this.updateNewsSource.bind(this);
    this.updatePageContent = this.updatePageContent.bind(this);
    this.renderPage = this.renderPage.bind(this);
    this.updateWhichPage = this.updateWhichPage.bind(this);
    this.populateArticleUrls = this.populateArticleUrls.bind(this);
    this.getPageContentForComponent = this.getPageContentForComponent.bind(this);
    this.validateSwitchedPages = this.validateSwitchedPages.bind(this);
  }

  updateWhichPage(pg) {
    if(this.state.source === 'guardian' && pg === 'sports/') {
      pg = 'sport/';
    }
    else if(this.state.source === 'nyt' && pg === 'sport/') {
      pg = 'sports/';
    }
    var apiHost = this.state.apiHost + pg;
    this.setState({
      isLoaded: false
    });
    fetch(apiHost + this.state.source)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            whichPage: pg,
            pageContent: result.results,
            isLoaded: false
          }, () => 
            this.validateSwitchedPages(pg, result.results)
          );
        }
      );
  }

  validateSwitchedPages(pg, results) {
    console.log('in validate switched pages');
    while(this.state.whichPage !== pg || this.state.pageContent !== results) {
    }
    this.setState({
      whichPage: pg,
      pageContent: results,
      isLoaded: true
    }, () => console.log('DONE'));
  } 


  updateNewsSource(src) {
    var newSource = src === 'nyt' ? 'guardian' : 'nyt';
    var wPage = this.state.whichPage;
    if(newSource === 'guardian' && wPage === 'sports/') {
      wPage = 'sport/';
    }
    else if(newSource === 'nyt' && wPage === 'sport/') {
      wPage = 'sports/';
    }
    var apiHost = this.state.apiHost + wPage;
    this.setState({
      isLoaded: false
    });
    fetch(apiHost + newSource)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          this.setState({
            pageContent: result.results,
            isLoaded: true,
            source: newSource,
            whichPage: wPage
          });
        }
      );
  }

  populateArticleUrls() {
    let routes = [];
    routes.push(
      <Route exact path={'/detailedPage/:pathId'}
            key={dKey}
            render={
              (props) =>
              <DetailedPage {...props}
                host={this.state.apiHost}
              />
            }
      />);
    dKey++;
    /*fetch(this.state.apiHost + 'getAllDetailedArticlePaths')
      .then(res =>res.json())
      .then(
        (result) => {
          for(let i = 0; i < result.data.length; i++) {
            routes.push(<Route exact path={'/detailedPage/' + result.data[i]} 
                                render={
                                  (props) => 
                                  <DetailedPage 
                                    articlePath={result.data[i]}
                                    host={this.state.apiHost}
                                  />
                                }
                          />);
          }
        }
      );*/
    const pages = ['home', 'world', 'politics', 'technology', 'business', 'sports'];
    for(let i = 0; i < pages.length; i++) {
      //var pgContent = this.getPageContentForComponent(this.state.source, pages[i]); 
      //console.log(this.state.source);
      routes.push(
        <Route exact path={'/' + pages[i]}
            key = {dKey}
            render={
              (props) => 
                <HomePage {...props}
                  source={this.state.source}
                  whichPage={pages[i]}
                  isLoaded={this.state.isLoaded}
                  pageContent={this.state.pageContent}
                  updatePageContent={this.updatePageContent}
                />
            }
        />
      );
      dKey++;
    }
    //push bookmarks page route
    routes.push(
      <Route exact path='/bookmarks'
        key={dKey}
        render={
              (props) => 
                <BookmarkPage {...props}/>
            }
      />
    );
    dKey++;
    //push search results page route
    routes.push(
      <Route exact path='/search/:query' 
        key={dKey}
        render={
          (props) => 
          <SearchPage {...props} 
            host={this.state.apiHost}
          />
        }
      />
    );
    this.setState({
      routes: routes
    });
    return;
  }

  updatePageContent() {
    //console.log('called update page content');
    var apiHost = this.state.apiHost + this.state.whichPage;
    fetch(apiHost + this.state.source)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            pageContent: result.results,
            isLoaded: true
          });
        }
      );
  }

  getPageContentForComponent(source, section) {
    var apiHost = this.state.apiHost + section + '/';
    var ans = [];
    fetch(apiHost + source)
      .then(res => res.json())
      .then(
        (result) => {
          ans = result.results;
          console.log(ans);
        });
    return ans;
  }

  renderPage() {
    return(<HomePage source={this.state.source} isLoaded={this.state.isLoaded} pageContent={this.state.pageContent} updatePageContent={this.updatePageContent}/>);
  }

  componentDidMount() {
    this.populateArticleUrls();
  }

  render() {
    const {routes} = this.state;
    return (
      <div id='App'>
      <BrowserRouter>
        <NavbarIdx 
          source={this.state.source} 
          updateNewsSource={this.updateNewsSource} 
          whichPage={this.state.whichPage} 
          updateWhichPage={this.updateWhichPage} 
        />
        <Switch>
        {routes}
        </Switch>
      </BrowserRouter>
      </div>
    );
  }
}

export default App;
