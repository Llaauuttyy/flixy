from app.db.database import Database
from app.dto.recommendation import Recommendations

class RecommendationService:
    def get_recommendations(self, db: Database, user_id: int) -> Recommendations:
        # Obtenemos todos los ratings
        puntaje_promedio_accion = 3.4
        cant_veces_accion = 17
        nivel_de_interes_accion = 0.3 * puntaje_promedio_accion + 0.7 * cant_veces_accion

        # De los ratings sacamos los generos mejores puntuados.
        # Del top 3 de esos géneros devolvemos una película de cada uno.
        pass