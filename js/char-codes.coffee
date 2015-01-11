#Multitran has it's own escaping rules for special symbols
# encodeUri: #multitran
CHAR_CODES =
  #Spanish
  '5' :
    '%C3%A1': '&#225;' # á
    '%C3%A9': '&#233;' # é
    '%C3%AD': '&#236;' # í
    '%C3%B1': '&#241;' # ñ
    '%C3%B3': '&#243;' # ó
    '%C3%BA': '&#250;' # ú
    '%C2%BF': '&#191;' # ¿
    '%C3%81': '&#193;' # Á
    '%C3%89': '&#201;' # É
    '%C3%8D': '&#205;' # Í
    '%C3%91': '&#209;' # Ñ
    '%C3%93': '&#211;' # Ó
    '%C3%9A': '&#218;' # Ú
    '%C2%A1': '&#161;' # ¡


module.exports = CHAR_CODES