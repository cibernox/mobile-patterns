export default function(){
  this.transition(
    this.fromRoute('news.index'),
    this.toRoute('news.show'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
}
