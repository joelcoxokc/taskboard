(function(){
  'use strict';

  /**
   * Using Rails-like standard naming convention for endpoints.
   * GET     /notes              ->  index
   * POST    /notes              ->  create
   * GET     /notes/:id          ->  show
   * PUT     /notes/:id          ->  update
   * DELETE  /notes/:id          ->  destroy
   */


    var _ = require('lodash');
    var Note = require('./note.model');

    // Get list of notes
    exports.index = function(req, res) {
      Note.find(function (err, notes) {
        if(err) { return handleError(res, err); }
        return res.json(200, notes);
      });
    };

    // Get a single note
    exports.show = function(req, res) {
      Note.findById(req.params.id, function (err, note) {
        if(err) { return handleError(res, err); }
        if(!note) { return res.send(404); }
        return res.json(note);
      });
    };

    // Creates a new note in the DB.
    exports.create = function(req, res) {
      Note.create(req.body, function(err, note) {
        if(err) { return handleError(res, err); }
        return res.json(201, note);
      });
    };

    // Updates an existing note in the DB.
    exports.update = function(req, res) {
      if(req.body._id) { delete req.body._id; }
      Note.findById(req.params.id, function (err, note) {
        if (err) { return handleError(res, err); }
        if(!note) { return res.send(404); }
        var updated = _.merge(note, req.body);
        updated.save(function (err) {
          if (err) { return handleError(res, err); }
          return res.json(200, note);
        });
      });
    };

    // Deletes a note from the DB.
    exports.destroy = function(req, res) {
      Note.findById(req.params.id, function (err, note) {
        if(err) { return handleError(res, err); }
        if(!note) { return res.send(404); }
        note.remove(function(err) {
          if(err) { return handleError(res, err); }
          return res.send(204);
        });
      });
    };

    /**
     * Note middleware
     */
    exports.noteByID = function(req, res, next, id) {
      Note.findById(id).populate('user', 'displayName').exec(function(err, note) {
        if (err) return next(err);
        if (!note) return next(new Error('Failed to load Note ' + id));
        req.note = note;
        next();
      });
    };

    /**
     * Note authorization middleware
     */
    exports.hasAuthorization = function(req, res, next) {
      if (req.note.user.id !== req.user.id) {
        return res.send(403, 'User is not authorized');
      }
      next();
    };
    function handleError(res, err) {
      return res.send(500, err);
    }

})();