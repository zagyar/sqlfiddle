define(["Handlebars"],function(e){e.registerHelper("each_with_index",function(e,t){var n="";k=0;for(var r=0,i=e.length;r<i;r++)if(e[r]){var s=e[r];s.index=k,s.first=k==0,s.last=k==e.length,n+=t(s),k++}return n})})