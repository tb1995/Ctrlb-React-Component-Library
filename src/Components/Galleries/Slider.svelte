<script>

</script>


      <div class="fp-slider-items">
        <div class="fp-slider-wrapper">
          <a href="#">
            <div class="fp-img">
              <img src="https://images.unsplash.com/photo-1519302959554-a75be0afc82a?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=e21b31e3bddc474a0a13b376d367e2ce" alt="Featured Property" />
            </div>
          </a>
        </div>
        <div class="fp-slider-wrapper">
          <a href="#">
            <div class="fp-img">
              <img src="https://images.unsplash.com/photo-1534479888607-8978e8243743?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=dcadee71cb7cff203f1497e4ddb97ccb" alt="Featured Property" />
            </div>
          </a>
        </div>
        <div class="fp-slider-wrapper">
          <a href="#">
            <div class="fp-img">
              <img src="https://images.unsplash.com/photo-1525619526717-37cba4c9c8a6?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=6bf44954af0448e201a664b4b8211c22" alt="Featured Property" />
            </div>
          </a>
        </div>
        <div class="fp-slider-wrapper">
          <a href="#">
            <div class="fp-img">
              <img src="https://images.unsplash.com/photo-1504396463218-15cec8dfd816?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=8275a6f19d63c736bc4c4cf628137a1b" alt="Featured Property" />
            </div>
          </a>
        </div>
        <div class="fp-slider-wrapper">
          <a href="#">
            <div class="fp-img">
              <img src="https://images.unsplash.com/photo-1519302959554-a75be0afc82a?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=e21b31e3bddc474a0a13b376d367e2ce" alt="Featured Property" />
            </div>
          </a>
        </div>
        <div class="fp-slider-wrapper">
          <a href="#">
            <div class="fp-img">
              <img src="https://images.unsplash.com/photo-1534479888607-8978e8243743?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=dcadee71cb7cff203f1497e4ddb97ccb" alt="Featured Property" />
            </div>
          </a>
        </div>
      </div>


<style type="text/scss">
@import './public/scss/theme.scss';
@import './public/scss/breakpoints.scss';


a:link, a:visited, a:hover, a:active, a:focus{
  text-decoration: none;
  outline: none;
}


.fp-wrapper {
    text-align: center;
    padding: 50px 0 75px;
}

.fp-slider-wrapper {
    padding: 7px;
}

.fp-slider-wrapper a {
    display: block;
    position: relative;
}

.fp-wrapper h1 {
    font: 400 40px 'Playfair Display', serif;
    color: #e1ab35;
    text-transform: uppercase;
}

.fp-wrapper span {
    font: 400 13px/21px 'Roboto', sans-serif;
    color: #680909;
}

.fp-slider-items.slick-initialized.slick-slider {
    padding: 38px 0 0;
}

.fp-slider-items button.slick-arrow{
    display: inline-block;
    position: absolute;
    width: 41px;
    height: 41px;
    top: 0;
    bottom: 0;
    margin: auto;
    transform: translateY(-40px);
    font-size:  0;
    border: none;
    outline: none;
}
.fp-slider-items button.slick-prev.slick-arrow {    
    left: -40px;
    background: url(images/arrows-left.png);
    background-color: red;
}

.fp-slider-items button.slick-next.slick-arrow {
    right: -40px;
    background: url(images/arrow-right.png);
}

.fp-slider-wrapper .fp-img:before {
    content: '';
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    background: rgba(153, 126, 67, .30);
    opacity: 0;
    outline: 1px solid #ffffff;
    outline-offset: -10px;
    -webkit-transition: all 0.6s;
    -moz-transition: all 0.6s;
    -o-transition: all 0.6s;
    -ms-transition: all 0.6s;
    transition: all 0.6s;
}

.fp-slider-wrapper .fp-img:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    opacity: 0;
    background: rgba(255, 255, 255, .5);
    -webkit-transition: all 0.6s;
    -moz-transition: all 0.6s;
    -o-transition: all 0.6s;
    -ms-transition: all 0.6s;
    transition: all 0.6s;
}

.fp-slider-wrapper:hover .fp-img:before, 
.fp-slider-wrapper:hover .fp-img:after {
    opacity: 1;
}

#ft-title{
    font: 500 13px/21px 'Roboto', sans-serif;
    color: #680909;
    text-transform: uppercase;
    letter-spacing: 0.20em;
}

.fp-img {
    position: relative;
}

.slick-slide img{
    display: inline-block;
    width: 100%;
    height: auto;
}

.slider-details {
    padding: 20px 0;
    opacity: 0;
    transition: all .3s ease;
}
        
.fp-slider-wrapper:hover .slider-details {
    opacity: 1;
}

.slider-details strong{
    font: 500 20px 'Roboto', sans-serif;
    color: #2f2f2f;
}

.slider-details a{
    font: 500 12px 'Roboto', sans-serif;
    color: #680909;
    line-height: 2.5em;
}

.slick-track * {
  outline: none;
}

</style>