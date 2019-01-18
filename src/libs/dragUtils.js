export const setDragAndDrop = (dragSelector, dropSelector, highLightClass, cb) => {
	$(dragSelector).draggable({
		helper: 'clone',
		revert: 'invalid',
		scroll: false
	})
	$(dropSelector).droppable({
		drop: function (event, ui) {
			cb($(ui.helper), event)
			// $('.dropDiv').append('<div class="drop-item">'+$(ui.helper).find('.ivu-cell-title').text()+'</div>').removeClass('drop-highlight');
		},
		over: function () {
			$(dropSelector).addClass(highLightClass)
		},
		out: function () {
			$(dropSelector).removeClass(highLightClass)
		}
	})
}
