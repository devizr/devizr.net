(function(){

	/* Slide 1 */
	slider.add({
	  src: "assets/images/slider/clouds-33.png",
	  left: "0px",
	  animation: {
	    delay: 0,
	    duration: 1000, 
	    end: "0", 
	    html: {
	      content: "" +
				  "<h2>The Missing Link <br>Between Module Loader <br>and Responsive Design</h2>", //+
	        //"<h2>Deliver different assets</h2>" +
	        //"<p>Mobile Site Version </p>", 
	      position: {
	        top: "10px", 
	        left: "45px"               
	      }
	    }
	  }
	}); 

	/* Slide 2 */
	slider.add({
	  src: "assets/images/slider/clouds-33.png",
	  left: "0px",
	  animation: {
	    delay: 0, 
	    duration: 1000, 
	    end: "0px", 
	    html: {
	      content: "" +
	        "<h2>Easy Build Integration</h2>" +
	        "<p>Devizr support your favorite JavaScript build system (Grunt, Gulp, Broccoli, ..).</p>", 
	      position: {
	        top: "10px", 
	        left: "45px"               
	      }
	    }
	  }
	}); 

	/* Slide 3 */
	slider.add({
	  src: "assets/images/slider/clouds-33.png",
	  left: "0px",
	  animation: {
	    delay: 0, 
	    duration: 1000, 
	    end: "0px", 
	    html: {
	      content: "" +
	        "<h2>Increase Mobile Performance</h2>" +
	        "<p>..</p>", 
	      position: {
	        top: "10px", 
	        left: "45px"               
	      }
	    }
	  }
	}); 


	slider.init({
	  id: '#screen'
	});
	
}());
