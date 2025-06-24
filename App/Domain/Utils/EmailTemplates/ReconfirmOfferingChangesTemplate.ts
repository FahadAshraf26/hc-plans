export default './CustomMessageTemaplate'
  .replace(
    '{@MESSAGE}',
    "<span style='display:block;'>You have successfully reconfirmed the changes. Happy investing!</span>",
  )
  .replace('{@TITLE}', 'Congrats');
