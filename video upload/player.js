///////////////////////////////////////////////////////////////////////////////
//
//  ExtendedPlayer
//
//  This extends the base player class, you may override the base player
//  member functions or add additional player functionality here. Here 
//  we monitor the mouse position and show popup player controls and chapter
//  controls if we hover near them.
//
///////////////////////////////////////////////////////////////////////////////
Type.registerNamespace('ExtendedPlayer');

ExtendedPlayer.Player = function(domElement) {
    ExtendedPlayer.Player.initializeBase(this, [domElement]);  
}
ExtendedPlayer.Player.prototype =  {
    _showControlsAtStart: true,
    
    xamlInitialize: function() {    
        ExtendedPlayer.Player.callBaseMethod(this, 'xamlInitialize');    
        this._animShowControls = this.get_element().content.findName("PlayerControls_Show");
	    this._animHideControls = this.get_element().content.findName("PlayerControls_Hide");
        this._animShowChapters = this.get_element().content.findName("ChapterArea_Show");
	    this._animHideChapters = this.get_element().content.findName("ChapterArea_Hide");
	    this._main = this.get_element().content.root;
	    
	    if (this._showControlsAtStart) {
	        this._showChapters(true);
	        this._showControls(true);
	        window.setTimeout(Function.createDelegate(this, this._initialHide), 2000);          
	    }
	    
	    this._t1 = this._main.addEventListener("mouseMove", Function.createDelegate(this, this._onMouseMove));
	    this._t2 = this._main.addEventListener("mouseLeave", Function.createDelegate(this, this._onMouseLeave));

        this._ySixths = this._main.height / 6;
    },   
    
    get_showControlsAtStart : function() {
        return this._showControlsAtStart;
    },
    set_showControlsAtStart: function(value) {
        this._showControlsAtStart = value;        
    },
    
    _initialHide: function() {
        this._showChapters(false);
        this._showControls(false);
    },

    _onMouseMove: function(sender, eventArgs) {  
        var height = this._main.height;
        var scaley = height ? (this.get_element().content.ActualHeight / height) : 1;
        
        var yScaled= eventArgs.getPosition(null).Y / scaley;
        
        if (yScaled > 5 * this._ySixths) this._showControls(true);
        if (yScaled < 5 * this._ySixths) this._showControls(false);
        if (yScaled < 1 * this._ySixths) this._showChapters(true);
        if (yScaled > 1 * this._ySixths) this._showChapters(false);
    },
    
    _onMouseLeave: function() {
        this._showChapters(false);
        this._showControls(false);
    },
    
    _showControls: function(show) {
        if (this._controlsShowing === show) return;
        this._controlsShowing = show;
        show ? this._animShowControls.begin() : this._animHideControls.begin();
    },
    
    _showChapters: function(show) {
        if (this._chaptersShowing === show) return;

        var chapters = this.get_chapters();
        if (!chapters || chapters.length === 0) {
		    return;
		}

        this._chaptersShowing = show;
        show ? this._animShowChapters.begin() : this._animHideChapters.begin();
    },

	xamlDispose: function() {
	    if (this._main) {
	        this._main.removeEventListener("mouseMove", this._t1);
	        this._main.removeEventListener("mouseLeave", this._t2);
	    }
	    this._main = null;
		this._animShowControls = null;
		this._animHideControls = null;
		this._animShowChapters = null;
		this._animHideChapters = null;
		ExtendedPlayer.Player.callBaseMethod(this, 'xamlDispose');
  	}
}
ExtendedPlayer.Player.registerClass('ExtendedPlayer.Player', EePlayer.Player);
