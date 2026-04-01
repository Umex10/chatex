sed -i 's/LocalDate createdAt/LocalDateTime createdAt/' /home/umejr/IdeaProjects/chatex/backend/src/main/java/org/devtiro/chatex/domain/entities/Shout.java
sed -i 's/LocalDate createdAt/LocalDateTime createdAt/' /home/umejr/IdeaProjects/chatex/backend/src/main/java/org/devtiro/chatex/domain/entities/Message.java
sed -i 's/LocalDate createdAt/LocalDateTime createdAt/' /home/umejr/IdeaProjects/chatex/backend/src/main/java/org/devtiro/chatex/domain/dtos/responses/ShoutDto.java
sed -i 's/LocalDate createdAt/LocalDateTime createdAt/' /home/umejr/IdeaProjects/chatex/backend/src/main/java/org/devtiro/chatex/domain/dtos/responses/MessageDto.java
sed -i 's/LocalDate createdAt/LocalDateTime createdAt/' /home/umejr/IdeaProjects/chatex/backend/src/main/java/org/devtiro/chatex/domain/dtos/responses/QuoteDto.java
sed -i 's/LocalDate createdAt/LocalDateTime createdAt/' /home/umejr/IdeaProjects/chatex/backend/src/main/java/org/devtiro/chatex/domain/dtos/responses/CommentDto.java

sed -i 's/import java.time.LocalDate;/import java.time.LocalDateTime;\nimport java.time.LocalDate;/' /home/umejr/IdeaProjects/chatex/backend/src/main/java/org/devtiro/chatex/domain/entities/Shout.java
sed -i 's/import java.time.LocalDate;/import java.time.LocalDateTime;\nimport java.time.LocalDate;/' /home/umejr/IdeaProjects/chatex/backend/src/main/java/org/devtiro/chatex/domain/entities/Message.java
sed -i 's/import java.time.LocalDate;/import java.time.LocalDateTime;\nimport java.time.LocalDate;/' /home/umejr/IdeaProjects/chatex/backend/src/main/java/org/devtiro/chatex/domain/dtos/responses/ShoutDto.java
sed -i 's/import java.time.LocalDate;/import java.time.LocalDateTime;\nimport java.time.LocalDate;/' /home/umejr/IdeaProjects/chatex/backend/src/main/java/org/devtiro/chatex/domain/dtos/responses/MessageDto.java
sed -i 's/import java.time.LocalDate;/import java.time.LocalDateTime;\nimport java.time.LocalDate;/' /home/umejr/IdeaProjects/chatex/backend/src/main/java/org/devtiro/chatex/domain/dtos/responses/QuoteDto.java
sed -i 's/import java.time.LocalDate;/import java.time.LocalDateTime;\nimport java.time.LocalDate;/' /home/umejr/IdeaProjects/chatex/backend/src/main/java/org/devtiro/chatex/domain/dtos/responses/CommentDto.java

sed -i 's/import java.time.LocalDate;/import java.time.LocalDateTime;\nimport java.time.LocalDate;/' /home/umejr/IdeaProjects/chatex/backend/src/main/java/org/devtiro/chatex/services/ipl/ShoutServiceIpl.java
sed -i 's/LocalDate.now()/LocalDateTime.now()/g' /home/umejr/IdeaProjects/chatex/backend/src/main/java/org/devtiro/chatex/services/ipl/ShoutServiceIpl.java

sed -i 's/import java.time.LocalDate;/import java.time.LocalDateTime;\nimport java.time.LocalDate;/' /home/umejr/IdeaProjects/chatex/backend/src/main/java/org/devtiro/chatex/services/ipl/MessageServiceIpl.java
sed -i 's/LocalDate.now()/LocalDateTime.now()/g' /home/umejr/IdeaProjects/chatex/backend/src/main/java/org/devtiro/chatex/services/ipl/MessageServiceIpl.java
